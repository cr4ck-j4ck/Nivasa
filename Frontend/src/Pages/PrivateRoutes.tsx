import UserStore from "@/Store/UserStore";

interface IprivateProps {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: IprivateProps):React.JSX.Element=> {
  const user = UserStore(state => state.user);
  if(user){
    return <div>{children}</div>;
  }else{
    return <h1>401</h1>
  }
};

export default PrivateRoutes;
