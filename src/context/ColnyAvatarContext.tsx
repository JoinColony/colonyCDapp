import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import noop from '~utils/noop';

export const ColnyAvatarContext = createContext<{
  colonyAvatar: string | null;
  colonyThumbnail: string | null;
  onSaveColonyAvatar: (avatar: string | null) => void;
  onSaveColonyThumbnail: (avatar: string | null) => void;
}>({
  colonyAvatar: '',
  colonyThumbnail: '',
  onSaveColonyAvatar: noop,
  onSaveColonyThumbnail: noop,
});

export const ColnyAvatarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [colonyAvatar, setColonyAvatar] = useState<string | null>(null);
  const [colonyThumbnail, setColonyThumbnail] = useState<string | null>(null);

  const onSaveColonyAvatar = (avatar: string | null) => {
    setColonyAvatar(avatar);
  };

  const onSaveColonyThumbnail = (thumbnail: string | null) => {
    setColonyThumbnail(thumbnail);
  };

  const value = useMemo(
    () => ({
      colonyAvatar,
      colonyThumbnail,
      onSaveColonyAvatar,
      onSaveColonyThumbnail,
    }),
    [colonyAvatar, colonyThumbnail, onSaveColonyAvatar, onSaveColonyThumbnail],
  );

  return (
    <ColnyAvatarContext.Provider {...{ value }}>
      {children}
    </ColnyAvatarContext.Provider>
  );
};

export const useColnyAvatarContext = () => useContext(ColnyAvatarContext);
