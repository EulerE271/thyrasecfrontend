import React, { useState } from "react";
import bg from "../../../assets/cabin.jpg";
import { Eye, EyeOff } from 'react-feather'; // Import Feather Icons

type LoginFormProps = {
  onLogin: (username: string, password: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const togglePasswordVisibility = () => {
    setType(showPassword ? "password" : "text");
    setShowPassword(!showPassword);
  };
  console.log(type)
  return (
    <div className="flex">
      <div className="w-screen ">
        <img src={bg} alt="Loging"></img>
      </div>
      <div className="w-1/2 p-8 flex justify-center items-center">
        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <h2 className="text-2xl font-semibold mb-4">ThyraSec</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>{" "}
          </div>
          <div className="mb-6">
            <button
              className="w-full bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default LoginForm;
