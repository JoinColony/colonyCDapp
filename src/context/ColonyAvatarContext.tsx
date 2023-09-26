import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import noop from '~utils/noop';

export const ColonyAvatarContext = createContext<{
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

export const ColonyAvatarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [colonyAvatar, setColonyAvatar] = useState<string | null>(null);
  const [colonyThumbnail, setColonyThumbnail] = useState<string | null>(null);

  const onSaveColonyAvatar = useCallback((avatar: string | null) => {
    setColonyAvatar(avatar);
  }, []);

  const onSaveColonyThumbnail = useCallback((thumbnail: string | null) => {
    setColonyThumbnail(thumbnail);
  }, []);

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
    <ColonyAvatarContext.Provider {...{ value }}>
      {children}
    </ColonyAvatarContext.Provider>
  );
};

export const useColonyAvatarContext = () => useContext(ColonyAvatarContext);
