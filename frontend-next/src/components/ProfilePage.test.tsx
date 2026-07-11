import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { vi } from "vitest";
import { store } from "@/store";
import { ProfilePage } from "./ProfilePage";
import { UserService } from "@/services/api";

function renderProfile() {
  return render(
    <Provider store={store}>
      <ProfilePage />
    </Provider>,
  );
}

const router = { push: vi.fn() };
vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("@/services/api", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/api")>("@/services/api");
  return {
    ...actual,
    UserService: {
      ...actual.UserService,
      profile: vi.fn(),
      updateProfile: vi.fn(),
    },
  };
});

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.mocked(UserService.profile).mockResolvedValue({
      data: {
        success: true,
        data: { name: "Ada Lovelace", email: "ada@example.com" },
      },
    });
  });

  it("loads and displays the current name, with a disabled email field", async () => {
    renderProfile();

    expect(await screen.findByDisplayValue("Ada Lovelace")).toBeInTheDocument();
    const emailInput = screen.getByDisplayValue("ada@example.com");
    expect(emailInput).toBeDisabled();
  });

  it("submits only name and password, never email or phone", async () => {
    const updateProfile = vi.mocked(UserService.updateProfile);
    updateProfile.mockResolvedValueOnce({
      data: { success: true, message: "Profile updated" },
    });
    const user = userEvent.setup();

    renderProfile();
    await screen.findByDisplayValue("Ada Lovelace");

    const nameInput = screen.getByDisplayValue("Ada Lovelace");
    await user.clear(nameInput);
    await user.type(nameInput, "Ada L.");
    await user.type(
      screen.getByPlaceholderText(/leave blank/i),
      "newpassword1",
    );
    await user.click(screen.getByRole("button", { name: /update profile/i }));

    expect(updateProfile).toHaveBeenCalledWith({
      name: "Ada L.",
      password: "newpassword1",
    });
  });
});
