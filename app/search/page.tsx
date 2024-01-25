import Search from "@/components/Search";


export const metadata ={
  title: "Search",
  description : "Search for products.."
}
const search = () => {

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Search />
    </div>
  );
};

export default search;
