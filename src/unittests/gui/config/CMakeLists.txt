# SPDX-FileCopyrightText: (C) 2025 Rimora Studio
# SPDX-License-Identifier: MIT

create_test(
  NAME ScreenTests
  DEPENDS gui
  SOURCE ScreenTests.cpp
  WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/src/lib/gui"
)
