'use client';

import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Tooltip,
} from '@nextui-org/react';
import { BiShareAlt } from 'react-icons/bi';
import { FaCopy } from 'react-icons/fa6';

export const Share = ({
  id,
  episode,
  title,
}: {
  id: string;
  episode: number;
  title: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_DOMAIN}/watch/${id}/${episode}`,
    );
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <Button
        variant="flat"
        color="primary"
        isIconOnly
        className="rounded-full"
        onPress={onOpen}
      >
        <BiShareAlt />
      </Button>

      <Modal size={'md'} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Share {title}
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                  <Input
                    isReadOnly
                    type="text"
                    variant="bordered"
                    defaultValue={`${process.env.NEXT_PUBLIC_DOMAIN}/watch/${id}/${episode}`}
                    label="Share URL"
                  />
                  <Tooltip content={isCopied ? 'Copied!' : 'Copy'}>
                    <Button
                      variant="flat"
                      color="primary"
                      isIconOnly
                      className="rounded-full"
                      onPress={handleCopy}
                    >
                      <FaCopy />
                    </Button>
                  </Tooltip>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
