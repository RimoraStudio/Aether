/*
 * Aether -- mouse and keyboard sharing utility
 * SPDX-FileCopyrightText: (C) 2016 Synergy App Ltd
 * SPDX-License-Identifier: GPL-2.0-only WITH LicenseRef-OpenSSL-Exception
 */

#include "aether/IPlatformScreen.h"

bool IPlatformScreen::fakeMediaKey(KeyID)
{
  return false;
}
