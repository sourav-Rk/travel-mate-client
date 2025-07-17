import GuideDashboard from "@/components/guide/GuideDashboard"
import NotFoundPage from "@/components/NotFound"
import GuideLogin from "@/pages/guide/GuideLogin"
import PasswordResetPage from "@/pages/guide/PasswordResetPage"
import { AuthGuideRout } from "@/protected/ProtectedRoute"
import { NoAuthGuideRoute } from "@/protected/PubliceRoute"
import { Routes, Route } from "react-router-dom"
const GuideRouter = () =>{
    return(
        <Routes>
         <Route path="/" element={<NoAuthGuideRoute element={<GuideLogin/>}/>}/>
         <Route path="/dashboard" element={<AuthGuideRout allowedRoles={["guide"]} element={<GuideDashboard/>}/>}/>
         <Route path="/reset-password" element={<PasswordResetPage/>}/>
         <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default GuideRouter