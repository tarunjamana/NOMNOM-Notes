const Layover = () => {
  return (
    <div
      className="fixed top-5 left-0 w-screen h-screen bg-center bg-no-repeat bg-contain opacity-5 pointer-events-none -z-10"
      style={{ backgroundImage: 'url("layover.png")' }}
    ></div>
  );
};

export default Layover;
