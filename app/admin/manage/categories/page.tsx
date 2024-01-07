'use client'
import SideBar from '@/components/SideBar'
import React, { useCallback, useEffect, useState } from 'react'
import { supabase } from "@/store/client";
import { TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { Avatar, Heading, Text } from "@radix-ui/themes";
import { Tooltip } from "@nextui-org/tooltip";
import { Empty, FloatButton, Image, Popover, Spin } from "antd";
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Skeleton } from "@nextui-org/skeleton";
interface DataType {
  key: string;
  name: {
    value: string;
    image: {
      data: {
        publicUrl: string;
      }
    }
  };
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (data) => {
      return (
        <div className="flex gap-2 items-center">
          <Image src={data?.image?.data?.publicUrl} alt={data.value} width={50} height={50}  
            style={{
              objectFit: 'cover',
            }}
            placeholder={
              <Skeleton style={{
                width: '50px',
                height: '50px' 
              }} />
            }
          />
          <Heading as="h4" title={data.value} children={data.value} />
        </div>
      )
    },
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const categories = () => {
  const [loading, setLoading] = useState(true);
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
          // format :   name: {
          // value: string;
          // image: {
          //   data: {
          //     publicUrl: string;
          //   }
          // }
          const data = {
            value: cat.name,
            image: {
              data: {
                publicUrl: url.data.publicUrl
              }
            }
          }
          NewData.push({
            ...cat,
            name: data
          })
        } else {
          const data = {
            value: cat.name,
            image: {
              data: {
                publicUrl: ''
              }
            }
          }
          NewData.push({
            ...cat,
            name: data
          })
        }
      })
      setCategories(NewData);
    }
    );
  }

  useEffect(() => {
    fetchCategories();
    setLoading(false);
  }, [])
  return (
    <>
      <SideBar activeKey="sub5" subkey="/admin/manage/categories">
        <div className="cat_wrap p-3">
          {loading && (
            <div className="flex w-full h-full items-center justify-center">
              <Spin size="large" />
            </div>
          )}
          {(!loading && !categories?.length) && (
            <Empty />
          )}
          {(!loading && categories?.length) && (
            <>
                <FloatButton
                  tooltip='Add new category'
                  type="primary"
                  icon={
                    <div className='w-full h-full'>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5.75V18.25"></path>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.25 12L5.75 12"></path>
                      </svg>
                   </div>
                  }
                />
              <Table columns={columns} dataSource={categories} />
            </>
          )}

        </div>
      </SideBar>
    </>
  )
}

export default categories