import { useMemo } from "react";
import { useFuzzyFilterPriorities } from "./useFuzzyFilterPriorities";
import { moveItem } from "@/lib/common/helpers/array";
import { useGetPrioritiesQuery, useUpdateManyPrioritesMutation } from "../queries";
import { orderByIndex } from "../core/utils";

type Props = {
  searchQuery?: string;
};

export function usePriorities(props?: Props) {
  const prioritiesQuery = useGetPrioritiesQuery();

  const updateManyPrioritiesMutation = useUpdateManyPrioritesMutation();

  const { filteredPriorities } = useFuzzyFilterPriorities({
    query: props?.searchQuery,
    priorities: prioritiesQuery.data,
  });

  const isFiltering = useMemo(
    () => !!props?.searchQuery && props.searchQuery.length > 0,
    [props?.searchQuery],
  );

  const priorities = useMemo(() => {
    if (isFiltering) return filteredPriorities;
    return prioritiesQuery.data ?? [];
  }, [filteredPriorities, isFiltering, prioritiesQuery.data]);

  const topPriority = useMemo(() => {
    if (!prioritiesQuery.isSuccess) return undefined;
    return prioritiesQuery.data.find((p) => p.order === 1);
  }, [prioritiesQuery.data, prioritiesQuery.isSuccess]);

  const movePriority = (args: { fromId: string; toId: string }) => {
    const fromIndex = priorities.findIndex((p) => p.id === args.fromId);
    const toIndex = priorities.findIndex((p) => p.id === args.toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const sortedPriorities = orderByIndex(
      moveItem({
        arr: priorities,
        fromIndex: fromIndex,
        toIndex: toIndex,
      }),
    );

    updateManyPrioritiesMutation.mutate({
      priorities: sortedPriorities,
    });
  };

  return {
    priorities,

    isLoading: prioritiesQuery.isLoading,
    isError: prioritiesQuery.isError,
    isFiltering,

    topPriority,

    movePriority,
  };
}
