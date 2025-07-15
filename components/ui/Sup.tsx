type SupProps = {
  supValue?: string;
};

const Sup = ({ supValue }: SupProps) => {
  return (
    <sup className="text-yellow-300 text-[12px] leading-[0] font-light">
      {supValue}
    </sup>
  );
};

export default Sup;
