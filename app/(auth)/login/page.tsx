"use client";
import * as yup from 'yup';
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const validationSchema = yup.object({
    userName: yup.string().required("Please enter username"),
    password: yup.string().required("Please enter password"),
  });

  const formik = useFormik({
    validationSchema,
    initialValues: {
      userName: "",
      password: "",
    },
    onSubmit: async () => {
      // event?.preventDefault();
      const data = {
        userName: formik.values.userName,
        password: formik.values.password,
      };

      let response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formik.values)
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem('token', result.token);
        router.push('/admin');
      }

      console.log(result)
    },
  });

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Login to your account
        </h1>
        <form className="space-y-4 md:space-y-6"  onSubmit={formik.handleSubmit}>
          <div>
            <label
              htmlFor="userName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Enter Username
            </label>
            <input
              type="userName"
              name="userName"
              id="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="azure"
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required={true}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Login in
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{" "}
            <Link href={"/signup"}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
