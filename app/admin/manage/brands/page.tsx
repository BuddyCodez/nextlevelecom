'use client'
import SideBar from '@/components/SideBar'
import { Card, Avatar, Skeleton, FloatButton, Modal, Input, Upload, Button, UploadProps, message, Spin } from 'antd';
import { UploadCloud } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const { Meta } = Card;
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { supabase } from '@/store/client';


const page = () => {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [modalLoading, setMoadlLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [brandName, setbrandName] = useState("");
    const [brandDescription, setbrandDescription] = useState("");
    const [brands, setbrands] = useState<any>();

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

    return (
        <>
            <SideBar activeKey='/admin/manage/brands' subkey='sub5'>
                <div className="flex justify-center p-3">
                    {loading && (<Spin size='large' />)}
                    {!loading && brands?.map((brand: any, index: number) => (

                        <Card key={index} style={{ width: 400, transition: 'all 0.2s ease-in-out' }}
                            hoverable
                            className=' hover:scale-105 '
                            actions={[
                                <div className='flex justify-center' key="edit">
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"></path>
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 19.25H13.75"></path>
                                    </svg>
                                </div>,
                                <div className="flex justify-center" key="delete">
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" >
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 7.75L7.59115 17.4233C7.68102 18.4568 8.54622 19.25 9.58363 19.25H14.4164C15.4538 19.25 16.319 18.4568 16.4088 17.4233L17.25 7.75"></path>
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 7.5V6.75C9.75 5.64543 10.6454 4.75 11.75 4.75H12.25C13.3546 4.75 14.25 5.64543 14.25 6.75V7.5"></path>
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 7.75H19"></path>
                                    </svg>
                                </div>
                            ]}
                        >
                            <Skeleton loading={loading} avatar active>
                                <Meta
                                    avatar={<Avatar style={{
                                        objectFit: 'contain',
                                        verticalAlign: 'middle'
                                    }} src={brand?.image_path} gap={4} size="large" shape='square' />}
                                    title={brand.name}
                                    description={brand.short_description}
                                />
                            </Skeleton>
                        </Card>))}
                </div>
                <Modal
                    open={open}
                    title={
                        <h3>Add new brand</h3>
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
                        <label htmlFor="name">Brand Name</label>
                        <Input placeholder='Enter brand name' id='name' onChange={(e) => setbrandName(e.target.value)} />
                        <label htmlFor="desc">Brand Description</label>
                        <Input placeholder='Enter description' id='desc' onChange={(e) => setbrandDescription(e.target.value)} />
                        <div className="flex w-full items-center justify-between">
                            <Upload
                                {...props}
                                maxCount={1}

                            >
                                <Button
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    icon={
                                        <UploadCloud />
                                    }
                                >Select Image</Button>

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