import { useMutation, useQuery } from "@tanstack/react-query";
import { sendGetPrioritiesRequest } from "./api/get";
import { sendCreateNewPriorityRequest } from "./api/create";
import { queryClient } from "../../query-client";
import {
  sendUpdateManyPrioritiesRequest,
  sendUpdatePriorityByIdRequest,
} from "./api/update";
import {
  sendDeleteManyPrioritiesRequest,
  sendDeletePriorityByIdRequest,
} from "./api/delete";

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
