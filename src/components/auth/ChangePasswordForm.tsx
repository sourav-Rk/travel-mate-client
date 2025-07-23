"use client"

import { useFormik } from "formik"
import * as Yup from "yup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, CheckCircle, AlertCircle, ArrowLeft, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useChangePasswordMutation } from "@/hooks/auth/useChangePassword"
import toast from "react-hot-toast"

// Password validation schema
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain 8+ characters, uppercase, lowercase, number, and special character",
    )
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm new password is required"),
});

type Props = {role : "client" | "vendor";}

export function ChangePasswordForm({role} : Props) {
  const navigate = useNavigate();
  
  const {mutate : updatePassword,isPending} = useChangePasswordMutation(role);

  const formik = useFormik({
    initialValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      updatePassword({currentPassword : values.currentPassword,newPassword : values.newPassword},{
        onSuccess :(data) =>{
          toast.success(data.message);
          navigate(-1);
        },
        onError :(error : any) => {
          toast.error(error?.response?.data.message || "Failed to update the password")
        }
      })
    },
  })


  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++
    return strength
  }

  const renderPasswordField = (
    name: keyof typeof formik.values,
    label: string,
    placeholder: string,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label} *
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          id={name}
          name={name}
          type= "password"
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`pl-10 pr-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
            formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
          }`}
          disabled={isPending}
        />
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle className="h-3 w-3" />
          <span>{formik.errors[name]}</span>
        </div>
      )}
    </div>
  )

  const passwordStrength = getPasswordStrength(formik.values.newPassword)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-md sm:max-w-lg lg:max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Change Password
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">Update your account password for better security</p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">Security Settings</CardTitle>
            <p className="text-slate-600 text-sm sm:text-base">
              Enter your current password and choose a new secure password
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Current Password */}
              {renderPasswordField("currentPassword", "Current Password", "Enter your current password")}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">New Password</span>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                {renderPasswordField("newPassword", "New Password", "Enter your new password")}

                {/* Password Strength Indicator */}
                {formik.values.newPassword && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                            level <= passwordStrength ? strengthColors[passwordStrength - 1] : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600">
                      Strength:{" "}
                      <span className="font-medium">{strengthLabels[passwordStrength - 1] || "Very Weak"}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                {renderPasswordField(
                  "confirmNewPassword",
                  "Confirm New Password",
                  "Confirm your new password",
                )}

                {/* Match Indicator */}
                {formik.values.confirmNewPassword &&
                  formik.values.newPassword === formik.values.confirmNewPassword &&
                  !formik.errors.confirmNewPassword && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-3 w-3" />
                      <span>Passwords match</span>
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !formik.isValid || !formik.dirty}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">Make sure your new password is strong and unique</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
