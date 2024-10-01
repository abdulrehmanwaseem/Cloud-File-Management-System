import React, { useRef, useState } from "react";
import Input from "../../components/Input";
import { useSelector } from "react-redux";
import { Link as LinkIcon } from "lucide-react";
import whatsappIcon from "../../../public/assets/whatsappIcon.png";

const ShareFileModal = () => {
  const { data } = useSelector((state) => state.modal);
  const [copied, setCopied] = useState(false);
  const input = useRef();

  const handleCopy = () => {
    navigator.clipboard.writeText(data).then(() => {
      input.current.select();
      setCopied(true);
      setTimeout(() => {
        input.current.setSelectionRange(0, 0);
        setCopied(false);
      }, 1000);
    });
  };
  const handleShare = () => {
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(
      data
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center w-full gap-2">
        <Input defaultValue={data} register={{ readOnly: true, ref: input }} />
        <button
          onClick={handleCopy}
          className={`btn ${
            !copied ? "bg-sky-400" : "btn-success"
          } text-slate-100 flex items-center gap-1`}
        >
          <LinkIcon />
          {!copied ? "Copy Url " : <span>Copied!</span>}
        </button>
      </div>
      <button
        onClick={handleShare}
        className="btn bg-green-500 text-white flex items-center justify-center w-full"
      >
        <img src={whatsappIcon} alt="icon" width={30} className="-mr-1" />
        Share on WhatsApp
      </button>
    </div>
  );
};

export default ShareFileModal;
