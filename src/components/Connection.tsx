import { Button, Dropdown, Menu, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../hooks/account';
import { AccountSelect } from './AccountSelect';
import { ShortAccount } from './ShortAccount';
import { WalletConnection } from './WalletConnection';

export function Connection() {
  const { t } = useTranslation();
  const [isSmartSwitcherVisible, setIsSmartSwitcherVisible] = useState(false);
  const [isAccountSwitcherVisible, setIsAccountSwitcherVisible] = useState(false);
  const { from, account, accounts, setAccount, switchFrom, setAccounts } = useAccount();

  useEffect(() => {
    if (!!accounts && !account) {
      setIsAccountSwitcherVisible(true);
    }
  }, [accounts, account]);

  return (
    <>
      {!!accounts ? (
        <section className='flex items-center gap-2'>
          {account && (
            <div className='flex items-center justify-between bg-main h-auto leading-normal gap-2 pl-4 rounded-xl'>
              <img
                src='/image/darwinia.7ff17f8e.svg'
                className='scale-150'
                style={{ height: 32 }}
                alt=''
              />
              <span className='text-purple-500 px-2 py-0.5 rounded-xl bg-white'>{t('Main')}</span>
              <ShortAccount
                account={account}
                className='self-stretch px-4 bg-white my-px mx-px rounded-xl'
              />
            </div>
          )}

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setIsAccountSwitcherVisible(true)}>
                  {t('Use another mainnet address')}
                </Menu.Item>
                <Menu.Item onClick={() => setIsSmartSwitcherVisible(true)}>
                  {t('Switch to smart address')}
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setAccount(null);
                    setAccounts(null);
                  }}
                >
                  {t('disconnect')}
                </Menu.Item>
              </Menu>
            }
          >
            <button className='dream-btn'>{t('Switch Wallet')}</button>
          </Dropdown>
        </section>
      ) : (
        <WalletConnection />
      )}

      <AccountSelect
        account={account}
        isVisible={isAccountSwitcherVisible}
        confirm={setAccount}
        cancel={() => setIsAccountSwitcherVisible(false)}
      />

      <Modal
        title={t('Switch Wallet')}
        visible={isSmartSwitcherVisible}
        onOk={() => {
          setIsSmartSwitcherVisible(false);
          switchFrom(from === 'main' ? 'smart' : 'main');
        }}
        onCancel={() => {
          setIsSmartSwitcherVisible(false);
        }}
        footer={[
          <button
            className='dream-btn w-1/2'
            onClick={() => {
              setIsSmartSwitcherVisible(false);
            }}
          >
            {t('Cancel')}
          </button>,
          <Button
            type='primary'
            onClick={() => {
              setIsSmartSwitcherVisible(false);
              switchFrom(from === 'main' ? 'smart' : 'main');
            }}
            className='w-1/2 bg-main border-none rounded-xl'
          >
            {t('Confirm')}
          </Button>,
        ]}
        wrapClassName='large-footer-btn'
      >
        <p>
          {t(
            'Do you want to login with darwinia smart account? Current account will be disconnect after switch to darwinia smart account.'
          )}
        </p>
      </Modal>
    </>
  );
}
