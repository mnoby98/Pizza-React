import CreateUser from "../features/user/CreateUser";
import { useSelector } from "react-redux";
import Button from "./Button";
function Home() {
  const username = useSelector((state) => state.user.userName);
  return (
    <div className="mt-10 sm:my-16 text-center px-4 ">
      <h1 className=" text-xl  mb-8  font-semibold md:text-4xl ">
        The best pizza.
        <br />
        <span className="text-yellow-500 ">
          Straight out of the oven, straight to you.
        </span>
      </h1>
      {username === "" ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          Countine ordering,{username}
        </Button>
      )}
    </div>
  );
}

export default Home;
