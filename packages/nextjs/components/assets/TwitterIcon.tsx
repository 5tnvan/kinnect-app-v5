type Props = {
  handle: any;
};

export const TwitterIcon = ({ handle }: Props) => {
  const link = "https://x.com" + handle;
  return (
    <>
      <a className=" hover:text-orange-600 mr-3" aria-label="Twitter" href={link} target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-twitter-x"
          viewBox="0 0 16 16"
        >
          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
        </svg>
      </a>
    </>
  );
};
