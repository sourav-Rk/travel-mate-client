import { useNavigate, useSearchParams } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useForgotPasswordResetMutaion } from "@/hooks/auth/useForgotPassword"

// Password schema using Yup
const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain 8+ characters, uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});


export default function PasswordResetForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") as string;
  const navigate = useNavigate();
  const {mutate : resetPassword} = useForgotPasswordResetMutaion();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      resetPassword({password : values.password,confirmPassword : values.confirmPassword,token},{
        onSuccess : (response) =>{
          toast.success(response.message);
          navigate("/");
        },
        onError :(error : any)=>{
          toast.error(error?.response?.data.message);
          navigate("/")
        }
      })
    },
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
        <Card className="shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your new secure password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10 pr-4 py-2"
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500">{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10 pr-4 py-2"
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                Reset Password
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4">
            Your new password should be strong and unique.
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
