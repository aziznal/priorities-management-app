import { normalizeString } from "@/lib/common/helpers/string";
import { useMemo } from "react";
import { Priority } from "../core/priority-type";

type Props = {
  query?: string;
  priorities?: Priority[];
};

export function useFuzzyFilterPriorities(props: Props) {
  const filteredPriorities: Priority[] = useMemo(() => {
    // new var to keep context non-null in below filter call
    const query = props.query;

    if (
      !query ||
      query === "" ||
      !props.priorities ||
      props.priorities.length === 0
    ) {
      return props.priorities || [];
    }

    return props.priorities.filter((p) => {
      const body = normalizeString(p.body);
      const q = normalizeString(query);
      return body.includes(q) || q.includes(body);
    });
  }, [props.priorities, props.query]);

  return {
    filteredPriorities,
  };
}
