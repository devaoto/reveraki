import Image from 'next/image';

export const InfoImg = ({ info }: { info: any }) => {
  return (
    <div className="overflow-x-hidden">
      {info.coverImage ? (
        <Image
          src={info.coverImage}
          alt={info.color}
          width={1920}
          height={900}
          className="object-cover min-h-[620px]"
        />
      ) : (
        <Image
          src={info.bannerImage}
          alt={info.color ?? info.title.english ?? info.title.romaji}
          width={1920}
          height={900}
          className="object-cover min-h-[620px] min-w-[1920px] max-h-[620px]"
        />
      )}
    </div>
  );
};
