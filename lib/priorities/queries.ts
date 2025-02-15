import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/client/query-client";
import { createNewPriority } from "./actions/create";
import { deletePriorityById, deleteManyPriorities } from "./actions/delete";
import { getPriorities } from "./actions/get";
import { updatePriorityById, updateManyPriorities } from "./actions/update";

export const priorityQueryKeyFactory = {
  all: "priorities",
  getAll: () => [priorityQueryKeyFactory.all, "get-all"] as const,
} as const;

export const useGetPrioritiesQuery = () =>
  useQuery({
    queryKey: priorityQueryKeyFactory.getAll(),
    queryFn: getPriorities,
  });

export const useCreatePriorityMutation = () =>
  useMutation({
    mutationFn: createNewPriority,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useUpdatePriorityMutation = () =>
  useMutation({
    mutationFn: updatePriorityById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useDeletePriorityByIdMutation = () =>
  useMutation({
    mutationFn: deletePriorityById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useUpdateManyPrioritesMutation = () =>
  useMutation({
    mutationFn: updateManyPriorities,

    onMutate(variables) {
      queryClient.setQueryData(
        priorityQueryKeyFactory.getAll(),
        variables.priorities,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useDeleteManyPrioritiesMutation = () =>
  useMutation({
    mutationFn: deleteManyPriorities,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });
