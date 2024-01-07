'use client';
// pages/admin/[...slug].tsx
import 'react-photo-editor/dist/style.css';
import "@/styles/admin.css";
import "@/styles/form.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import "@/styles/admin.css";
import { Button, Callout, Card, Flex, Inset, Strong, Text } from "@radix-ui/themes";
import * as Form from '@radix-ui/react-form';
import { Textarea } from "@nextui-org/input";
import { ReactPhotoEditor } from "react-photo-editor";
import { supabase } from '@/store/client';
import { Cross2Icon, InfoCircledIcon, Pencil1Icon, UploadIcon } from '@radix-ui/react-icons';
import { MdDelete } from "react-icons/md";
import Datatable from './datatable';
; const AdminPage = () => {
    const [file, setFile] = useState<File | undefined>()
    const [showModal, setShowModal] = useState(false);
    const [output, setOutput] = useState({
        type: '',
        message: ''
    });
    const [disbaled, setdisabled] = useState(false);
    const [categories, setCategories] = useState<any>([]);
    async function fetchCategories() {
        await supabase.from('categories').select('*').then(({ data, error }) => {
            if (error) {
                console.error(error);
                return;
            }
            // fetch categories 
            // we also need to get image url too.
            // so we will use supabase storage to get image url.
            const NewData: any[] | ((prevState: never[]) => never[]) = [];
            data.forEach(async (cat) => {
                if (cat.image_path) {
                    const imagePath = cat.image_path.replace('/web_data/', '');
                    const url = await supabase.storage.from('web_data').getPublicUrl(imagePath);
                    // image may contain  a /web_data twice so we need to remove it.

                    NewData.push({
                        ...cat,
                        image_path: url
                    })
                } else {
                    NewData.push(cat);
                }
            })
            console.log('data', NewData);
            setCategories(NewData);
        }
        );
    }
    const router = useRouter();
    const HandleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        setdisabled(true);
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const cname = formData.get("cname");
        const cdescription = formData.get("cdescription");
        const cimageValue = file ? file : formData.get("cimage") as File;
        const image_path = cimageValue ? '/web_data/cat_img/' + cimageValue.name : '';

        // first lets upload file to storage.
        if (cimageValue) {
            const { data: file, error } = await supabase.storage.from('web_data').upload('/cat_img/' + cimageValue.name, cimageValue);
            if (error) {
                console.error(error);
                setOutput({
                    type: 'error',
                    message: error?.message.toString() || error?.stack?.toString() || "Unknown error occured"
                })
            }
            else {
                setOutput({
                    type: 'success',
                    message: 'File uploaded successfully'
                })
            }
        }
        const data = {
            name: cname,
            description: cdescription,
            image_path: image_path,
        };

        const { data: newRecord, error } = await supabase
            .from('categories')
            .insert([
                data
            ]);
        if (error) {
            console.error(error);
            setOutput({
                type: 'error',
                message: error?.message.toString() || error.details.toString()
            })
        }
        else {
            setOutput({
                type: 'success',
                message: 'Category added successfully'
            })
        }
        setdisabled(false);
    }
    const showModalHandler = () => {
        if (file) {
            setShowModal(true)
        }
    }
    const ShortFileName = (name: string) => {
        return name.length > 10 ? name.substring(0, 10) + "..." : name
    }
    // Hide modal
    const hideModal = () => {
        setShowModal(false)
    }

    // Save edited image
    const handleSaveImage = (editedFile: File) => {
        setFile(editedFile);
    };

    const setFileData = (e: any) => {
        if (e?.target?.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }
    useEffect(() => {
        fetchCategories();
        return () => {
            setCategories([]);
        }
    }, [])
    return (
        <div className="admin_wrapper">
            <AdminNavbar />
            <h1 className="text-4xl my-3 font-bold text-center">Manage Categories</h1>
            <Flex className="admin_content p-2" align="center" justify="center" gap='4'>
                <div className="c1 w-[40%] p-4">
                    <Strong style={{ textTransform: "uppercase" }} className=" text-center">
                        Add New Category
                    </Strong>
                    <Form.Root className="FormRoot" onSubmit={HandleAddCategory}>
                        <Callout.Root highContrast hidden={!output?.type || !output?.message}>
                            <Callout.Icon>
                                {output.type == 'error' ? <InfoCircledIcon /> : <UploadIcon />}
                            </Callout.Icon>
                            <Callout.Text>
                                {output?.message}
                            </Callout.Text>
                        </Callout.Root>
                        <Form.Field className="FormField" name="cname">
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Form.Label className="FormLabel">Name</Form.Label>

                            </div>
                            <Form.Control asChild>
                                <input className="Input" type="text" required />
                            </Form.Control>
                        </Form.Field>
                        <Form.Field className="FormField" name="cdescription">
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>

                            </div>
                            <Form.Control asChild>
                                <textarea className="Textarea" />
                            </Form.Control>
                        </Form.Field>
                        <Form.Field className="FormField" name="cimage">
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Form.Label className="FormLabel">Image</Form.Label>
                                <Form.Message className="FormMessage" match="valueMissing">
                                    please provide an image for the category
                                </Form.Message>
                                <Form.Message className="FormMessage" match="typeMismatch">
                                    Please provide an valid image for the category, supported types are png,jpg and webp.
                                </Form.Message>
                                <Form.FormMessage className="FormMessage">
                                    <Text className="text-xs">
                                        {file ? ShortFileName(file.name) : "No file selected"}
                                    </Text>
                                </Form.FormMessage>
                            </div>
                            <div className="wrap">
                                <div className="Input flex items-center justify-center file-input-container">
                                    <Form.Control
                                        className="file-input"
                                        id="fileInput"

                                        type='file' onChange={(e) => setFileData(e)} multiple={false}
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                    />
                                    <div className="flex items-center justify-between w-full ">
                                        <label htmlFor="fileInput" className="custom-button text-sm"
                                        >Choose a Image</label>
                                        <label className="custom-button text-sm"
                                            onClick={showModalHandler}
                                        >Edit Image</label>
                                    </div>

                                </div>

                            </div>


                        </Form.Field>
                        <Form.Submit asChild>
                            <button className="Button" style={{ marginTop: 10 }}
                            disabled={disbaled}
                            >
                                Add Category
                            </button>
                        </Form.Submit>
                    </Form.Root>
                </div>
                <ReactPhotoEditor
                    open={showModal}
                    onClose={hideModal}
                    file={file}
                    onSaveImage={handleSaveImage}
                />
                <div className="c2 w-[60%] flex items-center justify-center">
                    <Flex className='p-3' align='center' justify='center' gap='2' wrap='wrap'>
                        {!categories.length && <div className="categoryScrollWrap">
                            <div className="flex flex-row gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                            </div>
                        </div>}
                        {categories.length && <Datatable categories={categories} />}
                        {/* {categories &&
                            categories.map((category: any, index: number) => <Card key={index} size="2" style={{ maxWidth: 240 }}>
                                <Inset clip="padding-box" side="top" pb="current">
                                    <img
                                        src={category?.image_path.data?.publicUrl}
                                        style={{
                                            display: 'block',
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: 140,
                                            backgroundColor: 'var(--gray-5)',
                                        }}
                                    />
                                </Inset>
                                <Flex justify='between'>
                                    <Text>Actions</Text>
                                    <Flex justify='center' gap='2'>
                                        <Button color='violet'>
                                            <Pencil1Icon />
                                        </Button>
                                        <Button color='red'>
                                            <MdDelete />
                                        </Button>
                                    </Flex>
                                </Flex>
                                <Strong>{category?.name}</Strong><br />
                                <p className='truncate'>
                                    {category?.description}
                                </p>
                            </Card>)
                        } */}
                    </Flex>
                </div>
            </Flex>
        </div>
    );
};

export default AdminPage;
