import SingleItem from "./SingleItem";
import { useFetchTasks } from "./reactQueryCustomHooks";
const Items = () => {
  const { isLoading, data, error } = useFetchTasks();

  if (isLoading) {
    return (
      <p style={{ marginTop: "2rem", fontSize: "1.5rem", textAlign: "center" }}>
        ...loading
      </p>
    );
  }
  if (error) {
    return (
      <p style={{ marginTop: "2rem", fontSize: "1.5rem", textAlign: "center" }}>
        {error.message}
      </p>
    );
  }
  return (
    <div className="items">
      {data.taskList.map((item) => {
        return <SingleItem key={item.id} item={item} />;
      })}
    </div>
  );
};
export default Items;
