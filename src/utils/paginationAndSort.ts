import { ParsedQs } from "qs";

interface IOptions {
  page: string;
  limit: string;
  sortBy: string;
  orderBy: "asc" | "desc";
}

const paginationAndSort = (query: ParsedQs) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  const skip = (page - 1) * limit;

  const sortBy = (query.sortBy || "createdAt") as string;
  const orderBy = (query.orderBy || "desc") as "asc" | "desc";

  return { skip, limit, sortBy, orderBy, page };
};

export default paginationAndSort;
