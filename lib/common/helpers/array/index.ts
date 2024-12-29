export function moveItem<T>(args: {
  arr: T[];
  fromIndex: number;
  toIndex: number;
}): T[] {
  const arr = [...args.arr];

  const element = args.arr[args.fromIndex];

  arr.splice(args.fromIndex, 1);

  arr.splice(args.toIndex, 0, element);

  return arr;
}
