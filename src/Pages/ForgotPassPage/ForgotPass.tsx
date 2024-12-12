import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Components/UserContext/UserContext";
import { sendEmail } from "../../api";
import { EmailRequest } from "../../ShopModels";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user && user.isAuthenticated) navigate("/dashboard");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const emailRequest: EmailRequest = { email, username };
      const response = await sendEmail(emailRequest);

      // Kiểm tra phản hồi trả về
      if (!response?.ok) {
        setError("Tài khoản hoặc email không chính xác!");
      } else {
        alert("Gửi mật khẩu về email thành công");
        navigate("/login");
        return;
      }
    } catch (error: any) {
      // Xử lý lỗi từ server hoặc lỗi kết nối
      if (error.response) {
        // Lỗi do server trả về (ví dụ: 400, 500)
        setError(error.response.data || "Lỗi xảy ra khi gửi email.");
      } else {
        // Lỗi khác (ví dụ: không kết nối được đến server)
        setError("Không thể kết nối đến máy chủ.");
      }
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Quên mật khẩu
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tài khoản
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nhập tài khoản"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nhập email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-400 text-white hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={loading} // Vô hiệu hóa nút trong khi đang tải
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
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    Đăng nhập
                  </Link>
                </div>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Đăng ký
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPass;
