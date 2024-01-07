'use client'
import SideBar from '@/components/SideBar'
import { Card, Avatar, Skeleton, FloatButton, Modal, Input, Upload, Button, UploadProps, message, Spin } from 'antd';
import { UploadCloud } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const { Meta } = Card;
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { supabase } from '@/store/client';
import { Select } from 'antd';


const page = () => {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [modalLoading, setMoadlLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [brandName, setbrandName] = useState("");
    const [brandDescription, setbrandDescription] = useState("");
    const [brands, setbrands] = useState<any>();
    const [categories, setCategories] = useState<any>();

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file as RcFile);
        });
        setUploading(true);
        // You can use any AJAX library you like
        const { data, error } = await supabase.storage.from('web_data').upload('/brand_img/' + fileList[0].name, fileList[0] as any);
        if (error) {
            message.error(`${error.message}`);
            setUploading(false);
            return;
        }
        if (data.path) {
            message.success('upload successfully.');
        }
        setUploading(false);
    };
    async function fetchCategories() {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) {
            console.error(error);
            return;
        }
        setCategories(data);
    }
    async function fetchBrands() {
        await supabase.from('brands').select('*').then(({ data, error }) => {
            if (error) {
                console.error(error);
                return;
            }
            let tempbrand: any[] = [];
            data?.forEach(async (brand: any) => {
                let imagePath = brand?.image_path?.replace('/web_data/', '');
                const { data } = await supabase.storage.from('web_data').getPublicUrl(imagePath);
                tempbrand.push({
                    ...brand,
                    image_path: data.publicUrl
                })
            })
            setbrands(tempbrand);
            console.log(tempbrand, data);
        });

    }
    useEffect(() => {
        fetchBrands();
        fetchCategories();
        setLoading(false);
    }, [])
    const showModal = () => {
        setOpen(true);
    };
    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].indexOf(file.type) === -1) {
                message.error(`${file.name} is not a image file`);
                return false;
            }
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <>
            <SideBar activeKey='/admin/manage/brands' subkey='sub5'>
                <div className="flex justify-center p-3">
                    {loading && (<Spin size='large' />)}

                </div>
                <Modal
                    open={open}
                    title={
                        <h3>Add new Product</h3>
                    }
                    onOk={() => {
                        return new Promise((resolve, reject) => {
                            setTimeout(async () => {
                                setMoadlLoading(true);
                                if (!brandDescription || !brandName) {
                                    message.error('Please fill all fields.');
                                    return reject;
                                }
                                if (fileList.length === 0) {
                                    message.error('Please select image.');
                                    return reject;
                                }
                                const { data, error } = await supabase.from('brands').insert(
                                    {
                                        name: brandName,
                                        short_description: brandDescription,
                                        image_path: `/brand_img/${fileList[0].name}`
                                    }
                                ).single();
                                if (error) {
                                    message.error(error.message);
                                    return reject;
                                }

                                message.success('Brand created successfully.');
                                setMoadlLoading(false);
                                setOpen(false);
                                return resolve;
                            }, 2000);
                        }).catch(() => console.log('Oops errors!'));
                    }}
                    cancelText='Cancel'
                    okText='Create brand'
                    closable={false}
                    confirmLoading={modalLoading}
                    onCancel={() => setOpen(false)}
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Product Name</label>
                        <Input placeholder='Enter brand name' id='name' onChange={(e) => setbrandName(e.target.value)} />
                        <label htmlFor="desc">Product Description</label>
                        <Input placeholder='Enter description' id='desc' onChange={(e) => setbrandDescription(e.target.value)} />
                        <div className="flex justify-between">
                            <Select
                                placeholder='Search categories'
                                filterOption={filterOption}
                                optionFilterProp="children"
                                showSearch
                                options={
                                    categories?.map((category: any) => {
                                        return {
                                            label: category.name,
                                            value: category.id
                                        }
                                    })
                                }
                                
                            />
                            <Select
                                placeholder='Search categories'
                                filterOption={filterOption}
                                optionFilterProp="children"
                                showSearch
                                options={
                                    brands?.map((brand: any) => {
                                        return {
                                            label: brand.name,
                                            value: brand.id
                                        }
                                    })
                                }

                            />

                        </div>
                        <div className="flex w-full items-center justify-between">
                            <Upload
                                {...props}
                            >
                                <Button
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    icon={
                                        <UploadCloud />
                                    }
                                >Select Images</Button>

                            </Upload>
                            <Button
                                onClick={handleUpload}
                                disabled={fileList.length === 0}
                                loading={uploading}
                            >
                                Upload Image
                            </Button>
                        </div>
                    </div>
                </Modal>
                <FloatButton
                    type='primary'
                    tooltip='Add new brand'
                    icon={
                        <div className='w-full h-full'>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5.75V18.25"></path>
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.75 12H18.25"></path>
                            </svg>
                        </div>
                    }

                    onClick={showModal}
                />
            </SideBar >
        </>
    )
}

export default page