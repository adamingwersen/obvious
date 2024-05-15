const NotProtectedLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className=" bg-gradientBackdrop flex h-[100vh]">
      <div className="flex h-full w-full">{children}</div>
    </div>
  );
};

export default NotProtectedLayout;
