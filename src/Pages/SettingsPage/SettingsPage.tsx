import { useContext, useState } from "react";
import Header from "../../Components/PageHeader/Header.tsx";
import { UserContext } from "../../Components/UserContext/UserContext.tsx";
import { changePassword } from "../../api.tsx";

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, logoutContext } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setLoading(false);
      setErrorMessage("Vui lòng nhập đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setErrorMessage("Mật khẩu mới không khớp!");
      return;
    }

    if (!user?.accessToken) {
      setLoading(false);
      setErrorMessage("Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }
    try {
      setLoading(true); // Đặt trạng thái loading trước khi thực hiện
      const response = await changePassword(
        user.username,
        oldPassword,
        newPassword,
        confirmPassword,
        user.accessToken
      );

      if (response && response.ok) {
        alert("Đổi mật khẩu thành công");
        logoutContext();
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-[0.5%] m-auto w-[80%]">
      <Header title={"Settings"} />
      <h2 className="text-2xl font-semibold mb-6 text-white ">Đổi mật khẩu</h2>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <label className="text-base  text-white font-medium w-1/5 text-right pr-8">
            Mật khẩu cũ:
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-2/4 px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="text-base text-white font-medium w-1/5 text-right pr-8">
            Mật khẩu mới:
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-2/4 px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="text-base text-white font-medium w-1/5 text-right pr-8">
            Nhập lại mật khẩu mới:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-2/4 px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className=" pr-8 text-base font-medium w-1/5 text-right"></label>
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mx-auto text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
