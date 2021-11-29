// Copyright (c) 2022 The catscoin 
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef catscoinUNITS_H
#define catscoinUNITS_H

#include <QString>
#include <QAbstractListModel>

/** catscoin unit definitions. Encapsulates parsing and formatting
   and serves as list model for drop-down selection boxes.
*/
class catscoinUnits: public QAbstractListModel
{
    Q_OBJECT

public:
    explicit catscoinUnits(QObject *parent);

    /** catscoin units.
      @note Source: https://en.catscoin.it/wiki/Units . Please add only sensible ones
     */
    enum Unit
    {
        CAN,
        mCAN,
        uCAN
    };

    //! @name Static API
    //! Unit conversion and formatting
    ///@{

    //! Get list of units, for drop-down box
    static QList<Unit> availableUnits();
    //! Is unit ID valid?
    static bool valid(int unit);
    //! Short name
    static QString name(int unit);
    //! Longer description
    static QString description(int unit);
    //! Number of Satoshis (1e-8) per unit
    static qint64 factor(int unit);
    //! Number of amount digits (to represent max number of coins)
    static int amountDigits(int unit);
    //! Number of decimals left
    static int decimals(int unit);
    //! Format as string
    static QString format(int unit, qint64 amount, bool plussign=false);
    //! Format as string (with unit)
    static QString formatWithUnit(int unit, qint64 amount, bool plussign=false);
    //! Parse string to coin amount
    static bool parse(int unit, const QString &value, qint64 *val_out);
    ///@}

    //! @name AbstractListModel implementation
    //! List model for unit drop-down selection box.
    ///@{
    enum RoleIndex {
        /** Unit identifier */
        UnitRole = Qt::UserRole
    };
    int rowCount(const QModelIndex &parent) const;
    QVariant data(const QModelIndex &index, int role) const;
    ///@}

private:
    QList<catscoinUnits::Unit> unitlist;
};
typedef catscoinUnits::Unit catscoinUnit;

#endif // catscoinUNITS_H
