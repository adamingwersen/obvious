const NotProtectedLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-[100vh] max-h-[100vh] overflow-hidden bg-gradientBackdrop">
      <div className="flex h-full w-full">{children}</div>
    </div>
  );
};

export default NotProtectedLayout;
