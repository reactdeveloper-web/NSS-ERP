import React from "react";
import MyProfile from "src/components/myprofile/myprofile";
//import { MainLayout } from "src/pages/layouts/MainLayout";

const _MyProfilePage = () => {
  return (
   
  
      <MyProfile />
   
  );
};

const MyProfilePage = React.memo(_MyProfilePage);
export default MyProfilePage;