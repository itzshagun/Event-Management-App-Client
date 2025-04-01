import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {

  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const token = Cookies.get("token");

    if (token) {
      navigate("/");
    } else {
      setShowContent(true);
    }
  }, [navigate]);

  return (showContent && <div>{children}</div>);
};

export default PublicLayout;
