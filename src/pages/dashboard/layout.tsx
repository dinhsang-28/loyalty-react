import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  AppstoreAddOutlined,
  GiftOutlined
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const  handleClick = (e :any)=>{
      if(e.key === "1"){
        navigate("/dashboard/overview");
      }else if(e.key === "2"){
        navigate("/dashboard/loyalty");
      }else if(e.key === "3"){
        navigate("/dashboard/affilate");
      }else if(e.key === "4"){
        navigate("/dashboard/settings");
      }
    }                         
  return (
    <Layout className="" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider className="!bg-white  [&_.ant-layout-sider-trigger]:!bg-white [&_.ant-layout-sider-trigger]:!text-black " 
      collapsed={collapsed} onCollapse={(e)=>setCollapsed(e)} collapsible>
        <div className={`text-green-800 font-bold font-sans text-2xl py-1 transition-all duration-[3000ms]  ${collapsed && 'flex justify-center item-center'}`} style={{ height: 32, margin: 16, background: "rgba(255, 255, 255, 0.3)" }} >{!collapsed ? "LoyalHub" :"L"} </div>
        <Menu className="[&_.ant-menu-item-selected]:!bg-green-500 [&_.ant-menu-item-selected]:!text-white [&_.ant-menu-item:hover]:!bg-green-300 font-sans font-medium" theme="light" mode="inline" onClick={(e)=>handleClick(e)}   defaultSelectedKeys={["1"] }>
          <Menu.Item key="1" icon={<AppstoreAddOutlined />}>
            Overview
          </Menu.Item>
          <Menu.Item key="2" icon={<GiftOutlined />}>
            Loyalty
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Affilate
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung chính */}
      <Layout className="">
        <Content className="" style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
