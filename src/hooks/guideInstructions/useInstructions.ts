import {
  getInstructionsClient,
  markAllInstructionsRead,
  markSingleInstructionRead,
} from "@/services/client/client.service";
import { createInstruction } from "@/services/guide/guide.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useClientAuth } from "../auth/useAuth";
import type { IGuideInstructionDto } from "@/types/instructionType";
import { useEffect, useState } from "react";

//to create instructions
export const useCreateInstructions = () => {
  return useMutation({
    mutationFn: createInstruction,
  });
};

//to get all the instructions
export const useGetInstructionsClient = () => {
  const { isLoggedIn, clientInfo } = useClientAuth();
  
  return useQuery({
    queryKey: ["instructions", clientInfo?.id],
    queryFn: getInstructionsClient,
    enabled: !!isLoggedIn && !!clientInfo?.id && clientInfo.role === "client", 
    retry: 1,
    staleTime: 5 * 60 * 1000, 
  });
};

//to mark a single instruction read
export const useMarkSingleInstructionRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markSingleInstructionRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["instructions"] }),
  });
};

//mark all instructions read
export const useMarkAllInstructionsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllInstructionsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["instructions"] }),
  });
}

export const useUnreadInstructions = () => {
  const { clientInfo,isLoggedIn } = useClientAuth();
  const {
    data,
    isLoading,
    refetch
  } = useGetInstructionsClient();
  
  const { 
    mutate: markSingleInstruction, 
    isPending: isMarkingSingle 
  } = useMarkSingleInstructionRead();
  
  const { 
    mutate: markAllInstructions, 
    isPending: isMarkingAll 
  } = useMarkAllInstructionsRead();
  
   const [allInstructions, setAllInstructions] = useState<IGuideInstructionDto[]>([]);
  // const [unreadInstructions, setUnreadInstructions] = useState<IGuideInstructionDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentlyMarking, setCurrentlyMarking] = useState<string | null>(null);

  useEffect(() => {
 
    if (isLoggedIn && clientInfo?.id && clientInfo.role === "client") {
      refetch();
    }
  }, [clientInfo?.id, refetch,isLoggedIn]);

  useEffect(() => {
    if (data?.data && clientInfo?.id && isLoggedIn) {
      const instructions = Array.isArray(data.data) ? data.data : [data.data];

       setAllInstructions(instructions);

      const unread = instructions.filter(
        (instruction) => !instruction.readBy.includes(clientInfo.id)
      );

      // setUnreadInstructions(unread);

      if (unread.length > 0) {
        setShowModal(true);
      }
    }
  }, [data, clientInfo?.id,isLoggedIn]);

   const unreadInstructions = allInstructions.filter(
    instruction => !instruction.readBy.includes(clientInfo?.id || "")
  );
  
  const readInstructions = allInstructions.filter(
    instruction => instruction.readBy.includes(clientInfo?.id || "")
  );

  const markAsRead = (instructionId: string) => {
   
    if (!isLoggedIn || !clientInfo?.id) return;

    setCurrentlyMarking(instructionId);
    markSingleInstruction(instructionId, {
      onSuccess: () => {
           setAllInstructions(prev => 
          prev.map(instruction => 
            instruction._id === instructionId 
              ? { 
                  ...instruction, 
                  readBy: [...instruction.readBy, clientInfo.id] 
                } 
              : instruction
          )
        );
        setCurrentlyMarking(null);
      },
      onError: (error) => {
        console.error("Failed to mark instruction as read:", error);
        setCurrentlyMarking(null);
      }
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const markAllAsRead = () => {
    if (!isLoggedIn || !clientInfo?.id) return;
    markAllInstructions(undefined, {
      onSuccess: () => {
        setAllInstructions(prev => 
          prev.map(instruction => 
            !instruction.readBy.includes(clientInfo.id)
              ? { 
                  ...instruction, 
                  readBy: [...instruction.readBy, clientInfo.id] 
                } 
              : instruction
          )
        );
        setShowModal(false);
      },
      onError: (error) => {
        console.error("Failed to mark all instructions as read:", error);
      }
    });
  };

  return {
    allInstructions,
    showModal,
    closeModal,
    markAsRead,
    markAllAsRead,
    isLoading : isLoading || !isLoggedIn,
    isMarkingSingle: isMarkingAll, 
    isMarkingAll,
    currentlyMarking
  };
};