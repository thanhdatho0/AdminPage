import { createContext, ReactNode, useEffect, useState } from "react";
import { User, UserContextType } from "../../ShopModels";
import { refreshToken } from "../../api";

export const UserContext = createContext<UserContextType>({
  user: {
    isAuthenticated: false,
    accessToken: "",
    username: "",
  },
  loginContext: () => {},
  logoutContext: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          isAuthenticated: false,
          accessToken: "",
          username: "",
        };
  });

  const loginContext = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    window.location.reload();
  };

  const logoutContext = () => {
    setUser({
      isAuthenticated: false,
      accessToken: "",
      username: "",
    });
    localStorage.removeItem("user"); // Xóa dữ liệu
  };

  const getAccessToken = async (token: string) => {
    try {
      const response = await refreshToken(token);
      if (response && response.data) {
        const newAccessToken = response.data.accessToken;
        setUser((prevUser: any) => {
          const updatedUser = {
            ...prevUser,
            accessToken: newAccessToken, // Cập nhật accessToken mới
            isAuthenticated: true,
            username: user.username,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser)); // Lưu lại vào localStorage
          // console.log("new" + user.accessToken);
          return updatedUser; // Trả về updatedUser
        });
      }
    } catch (error) {
      console.error("Lỗi refresh token", error);
      logoutContext();
    }
  };

  useEffect(() => {
    if (user.isAuthenticated) {
      const intervalId = setInterval(() => {
        getAccessToken(user.accessToken);
      }, 25 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [user.accessToken]);

  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </UserContext.Provider>
  );
};
