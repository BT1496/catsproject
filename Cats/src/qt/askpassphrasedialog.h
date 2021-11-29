// Copyright (c) 2022 The catscoin 
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef ASKPASSPHRASEDIALOG_H
#define ASKPASSPHRASEDIALOG_H

#include <QDialog>

namespace Ui {
    class AskPassphraseDialog;
}
class WalletModel;

/** Multifunctional dialog to ask for password. Used for encryption, unlocking, and changing the password.
 */
class AskPassphraseDialog : public QDialog
{
    Q_OBJECT

public:
    enum Mode {
        Encrypt,    /**< Ask password twice and encrypt */
        Unlock,     /**< Ask password and unlock */
        ChangePass, /**< Ask old password + new password twice */
        Decrypt     /**< Ask password and decrypt wallet */
    };

    explicit AskPassphraseDialog(Mode mode, QWidget *parent = 0);
    ~AskPassphraseDialog();

    void accept();

    void setModel(WalletModel *model);

private:
    Ui::AskPassphraseDialog *ui;
    Mode mode;
    WalletModel *model;
    bool fCapsLock;

private slots:
    void textChanged();
    bool event(QEvent *event);
    bool eventFilter(QObject *object, QEvent *event);
};

#endif // ASKPASSPHRASEDIALOG_H
