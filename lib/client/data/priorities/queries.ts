import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/client/query-client";
import {
  sendGetPrioritiesRequest,
  sendUpdateManyPrioritiesRequest,
  sendUpdatePriorityByIdRequest,
  sendDeleteManyPrioritiesRequest,
  sendDeletePriorityByIdRequest,
  sendCreateNewPriorityRequest,
} from ".";

export const priorityQueryKeyFactory = {
  all: "priorities",
  getAll: () => [priorityQueryKeyFactory.all, "get-all"] as const,
} as const;

export const useGetPrioritiesQuery = () =>
  useQuery({
    queryKey: priorityQueryKeyFactory.getAll(),
    queryFn: sendGetPrioritiesRequest,
  });

export const useCreatePriorityMutation = () =>
  useMutation({
    mutationFn: sendCreateNewPriorityRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useUpdatePriorityMutation = () =>
  useMutation({
    mutationFn: sendUpdatePriorityByIdRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useDeletePriorityByIdMutation = () =>
  useMutation({
    mutationFn: sendDeletePriorityByIdRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useUpdateManyPrioritesMutation = () =>
  useMutation({
    mutationFn: sendUpdateManyPrioritiesRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });

export const useDeleteManyPrioritiesMutation = () =>
  useMutation({
    mutationFn: sendDeleteManyPrioritiesRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priorityQueryKeyFactory.getAll(),
      });
    },
  });
