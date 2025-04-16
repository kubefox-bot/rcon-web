import { Singleton } from "@/utils/singleton";
import { jwtDecode } from "jwt-decode";
import { type Result, err, ok } from "neverthrow";

interface Claims {
	sub: string;
	iat: number;
	exp: number;
}

const TOKEN_KEY = "token";

@Singleton
export class JwtStorage {
	getToken(): Result<string, string> {
		const token = localStorage.getItem(TOKEN_KEY);
		return token ? ok(token) : err("Token not found");
	}

	setToken(token: string) {
		localStorage.setItem(TOKEN_KEY, token);
	}

	removeToken() {
		localStorage.removeItem(TOKEN_KEY);
	}

	getClaims(): Result<Claims, string> {
		return this.getToken().andThen((token) => {
			try {
				const decoded = jwtDecode<Claims>(token);
				return ok(decoded);
			} catch {
				return err("Invalid token");
			}
		});
	}

	isAuthenticated(): boolean {
		return this.getClaims()
			.map((c) => c.exp > Math.floor(Date.now() / 1000))
			.unwrapOr(false);
	}
}

export const jwt = new JwtStorage();
