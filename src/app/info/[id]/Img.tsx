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
          className="min-h-[620px] object-cover"
        />
      ) : (
        <Image
          src={info.bannerImage}
          alt={info.color ?? info.title.english ?? info.title.romaji}
          width={1920}
          height={900}
          className="max-h-[620px] min-h-[620px] min-w-[1920px] object-cover"
        />
      )}
    </div>
  );
};
