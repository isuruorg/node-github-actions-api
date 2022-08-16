interface ServiceHandlerProps {
  data: any;
  error: string;
}
const serviceHandler = (data: any, error: any) => {
  return { data: data, error: error };
};

export default serviceHandler;
export { ServiceHandlerProps };
