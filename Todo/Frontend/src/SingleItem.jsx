import { useEdit, useDelete } from "./reactQueryCustomHooks";

const SingleItem = ({ item }) => {
  const { editTask } = useEdit();
  const { deleteTask } = useDelete();

  const handleEdit = (id) => {
    editTask(id, item.isDone);
  };

  const handleDelete = (id) => {
    deleteTask(id);
  };
  return (
    <div className="single-item">
      <input
        type="checkbox"
        checked={item.isDone}
        onChange={() => handleEdit(item.id)}
      />
      <p
        style={{
          textTransform: "capitalize",
          textDecoration: item.isDone && "line-through",
        }}
      >
        {item.title}
      </p>
      <button
        className="btn remove-btn"
        type="button"
        onClick={() => handleDelete(item.id)}
      >
        delete
      </button>
    </div>
  );
};
export default SingleItem;
