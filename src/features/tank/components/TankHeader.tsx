interface TankHeaderProps {
  idCode: string;
}

export function TankHeader({ idCode }: TankHeaderProps) {
  return (
    <div className="bg-[#788a99] rounded-t-lg px-8 py-5 flex justify-between items-center text-white shrink-0">
      <h2 className="text-lg font-semibold tracking-wide">Tank Members</h2>
      <p className="text-base font-semibold tracking-wide">
        YOUR ID : {idCode || "******"}
      </p>
    </div>
  );
}
