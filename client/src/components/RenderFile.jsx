import {
  audioFormats,
  documentFormats,
  imageFormats,
  textFormats,
  videoFormats,
} from "../constants/formats";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { Frown } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

const RenderFile = (url, format, name) => {
  const className =
    "border-4 border-sky-700 max-w-full lg:max-w-2xl max-h-[50vh] object-contain rounded-lg";

  if (videoFormats.includes(format)) {
    return (
      <video src={url} controls autoPlay className={`${className} w-full`} />
    );
  }
  if (audioFormats.includes(format)) {
    return (
      <audio controls src={url} className={`${className} w-full border-none`} />
    );
  }

  if (textFormats.includes(format)) {
    return <RenderTextFile url={url} className={className} />;
  }

  if (documentFormats.includes(format)) {
    return <RenderDocuments url={url} />;
  }

  if (imageFormats.includes(format)) {
    return <img src={url} className={className} alt={name} />;
  } else
    return (
      <div
        className={`${className} flex justify-center items-center p-4 gap-2`}
      >
        <Frown />
        <span>File format isn't supported to display</span>{" "}
      </div>
    );
};

export default RenderFile;

const RenderDocuments = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedPages, setLoadedPages] = useState([1]); // Initial pages to load

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleLoadError = (error) => {
    console.log(error);
    toast.error("Error while loading document");
    setIsLoading(false);
  };

  const loadMorePages = () => {
    let loadedPage = loadedPages.length;

    if (numPages && loadedPage < numPages) {
      const nextPages = [];
      for (let i = loadedPage + 1; i <= loadedPage + 5 && i <= numPages; i++) {
        nextPages.push(i);
      }
      setLoadedPages((prev) => [...prev, ...nextPages]);
    }
  };

  return (
    <div
      id="scrollableDiv"
      className="overflow-auto max-h-96 customized-scrollbar object-fit border-4 border-sky-700"
    >
      <Document
        className="object-fit"
        file={url}
        onLoadError={handleLoadError}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Spinner />}
      >
        <InfiniteScroll
          dataLength={loadedPages.length}
          next={loadMorePages}
          hasMore={loadedPages.length < numPages}
          loader={<Spinner />}
          scrollableTarget="scrollableDiv"
        >
          {loadedPages.map((pageNum) => (
            <Page
              key={`page_${pageNum}`}
              pageNumber={pageNum}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={0.8}
            />
          ))}
        </InfiniteScroll>
      </Document>
      {isLoading && <Spinner />}
    </div>
  );
};

const RenderTextFile = ({ url, className }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        setContent(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error while loading text file");
        setIsLoading(false);
      });
  }, [url]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div
      className={`${className} bg-base-300 p-4 rounded-lg overflow-auto customized-scrollbar max-h-[22rem]`}
    >
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
};
