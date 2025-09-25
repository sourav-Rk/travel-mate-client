"use client"

import GuideDetailsComponent from "@/components/client/guide/GuideDetails"
import { LoaderFive } from "@/components/ui/loader"
import { useGetGuideDetailsQuery } from "@/hooks/client/useGuide"
import type { GuideDetailsForClientDto } from "@/types/api/client"
import {motion} from "framer-motion"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function GuideDetailsPage() {
    const {guideId} = useParams<{guideId : string}>();
    const [guide,setGuide] = useState<GuideDetailsForClientDto>()
    const {data,isLoading} = useGetGuideDetailsQuery(guideId!);

    useEffect(() => {
        if(data){
            setGuide(data.guide);
        }
    },[data]);

    if(isLoading){
        return <LoaderFive text="Loadingg"/>
    }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {guide &&<GuideDetailsComponent guide={guide!}/>}
    </motion.div>
  )
}