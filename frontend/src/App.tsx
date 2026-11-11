
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  Wallet,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import "./App.css";


const API = "http://localhost:8000";

type Account = {
  id: number;
  owner_name: string;
  balance: number;
};

type Payment = {
  id: number;
  sender_id: number;
  receiver_id: number;
  amount: number;
  status: string;
};

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [owner, setOwner] = useState("");
  const [initialBalance, setInitialBalance] = useState("5000");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const successfulPayments = payments.filter(p => p.status === "SUCCESS");
  const totalTransferred = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  async function refreshData() {
    try {
      const [accountResponse, paymentResponse] = await Promise.all([
        axios.get<Account[]>(`${API}/accounts/`),
        axios.get<Payment[]>(`${API}/payments/`)
      ]);
      setAccounts(accountResponse.data);
      setPayments(paymentResponse.data);
    } catch {
      setError("Cannot connect to PayMesh API. Check that Docker is running.");
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      await axios.post(`${API}/accounts/`, {
        owner_name: owner,
        initial_balance: Number(initialBalance)
      });
      setOwner("");
      setInitialBalance("5000");
      setNotice("Account created successfully.");
      await refreshData();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  async function makePayment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!sender || !receiver) {
      setError("Select both sender and receiver accounts.");
      return;
    }

    if (sender === receiver) {
      setError("Sender and receiver must be different.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/payments/`,
        {
          sender_id: Number(sender),
          receiver_id: Number(receiver),
          amount: Number(amount)
        },
        {
          headers: {
            "Idempotency-Key": crypto.randomUUID()
          }
        }
      );

      setNotice(`Payment #${response.data.id} completed successfully.`);
      setAmount("");
      await refreshData();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Payment failed.");
    } finally {
      setLoading(false);
    }
  }

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Wallet size={23} /></div>
          <div>
            <h2>PayMesh</h2>
            <span>PAYMENT INFRASTRUCTURE</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active"><LayoutDashboard size={18} /> Overview</div>
        <div className="nav-item"><CreditCard size={18} /> Accounts</div>
        <div className="nav-item"><ArrowUpRight size={18} /> Transfers</div>
        <div className="nav-item"><Activity size={18} /> Transactions</div>

        <div className="sidebar-bottom">
          <div className="security-icon"><ShieldCheck size={19} /></div>
          <div>
            <strong>Payment engine</strong>
            <span>Local development mode</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">PAYMENT OPERATIONS / OVERVIEW</div>
            <h1>Dashboard</h1>
          </div>
          <button className="refresh-button" onClick={refreshData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && <div className="alert error"><AlertCircle size={18} /> {error}</div>}
        {notice && <div className="alert success"><CheckCircle2 size={18} /> {notice}</div>}

        <section className="welcome-row">
          <div>
            <h2>Good to see you.</h2>
            <p>Monitor your accounts and payment activity in one place.</p>
          </div>
          <div className="live-status"><span /> API CONNECTED WHEN AVAILABLE</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top"><span>Total account balance</span><Wallet /></div>
            <h2>{money(totalBalance)}</h2>
            <p>Across {accounts.length} accounts</p>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Successful transfers</span><ArrowUpRight /></div>
            <h2>{successfulPayments.length}</h2>
            <p>Recorded payment operations</p>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Total transferred</span><CreditCard /></div>
            <h2>{money(totalTransferred)}</h2>
            <p>Successful payments only</p>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>System status</span><Activity /></div>
            <h2 className="status-text">Operational</h2>
            <p>Dashboard API connection</p>
          </div>
        </section>

        <section className="work-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Create account</h3>
                <p>Set up a new payment account</p>
              </div>
              <div className="panel-icon"><Plus /></div>
            </div>
            <form onSubmit={createAccount}>
              <label>Account holder</label>
              <input
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="e.g. Aryan"
                minLength={2}
                required
              />
              <label>Opening balance (₹)</label>
              <input
                type="number"
                min="0"
                value={initialBalance}
                onChange={e => setInitialBalance(e.target.value)}
                required
              />
              <button className="primary-button" disabled={loading}>
                <Plus size={17} /> Create account
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Send money</h3>
                <p>Transfer between PayMesh accounts</p>
              </div>
              <div className="panel-icon"><Send /></div>
            </div>
            <form onSubmit={makePayment}>
              <label>From account</label>
              <select value={sender} onChange={e => setSender(e.target.value)} required>
                <option value="">Select sender</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.owner_name} — #{a.id} ({money(a.balance)})
                  </option>
                ))}
              </select>
              <label>To account</label>
              <select value={receiver} onChange={e => setReceiver(e.target.value)} required>
                <option value="">Select receiver</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.owner_name} — #{a.id}
                  </option>
                ))}
              </select>
              <label>Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
              <button className="primary-button" disabled={loading || accounts.length < 2}>
                <Send size={17} /> Transfer money
              </button>
            </form>
          </div>
        </section>

        <section className="panel accounts-panel">
          <div className="panel-heading">
            <div>
              <h3>Accounts</h3>
              <p>Your registered payment accounts</p>
            </div>
            <span className="count-pill">{accounts.length} ACCOUNTS</span>
          </div>

          {accounts.length === 0 ? (
            <p className="empty-state">No accounts yet. Create your first account above.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ACCOUNT</th><th>ACCOUNT ID</th><th>BALANCE</th></tr>
                </thead>
                <tbody>
                  {accounts.map(account => (
                    <tr key={account.id}>
                      <td><div className="account-name"><div className="avatar">{account.owner_name.charAt(0).toUpperCase()}</div>{account.owner_name}</div></td>
                      <td>#{account.id}</td>
                      <td className="amount-cell">{money(account.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel accounts-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent transactions</h3>
              <p>Latest payment activity</p>
            </div>
            <span className="count-pill">{payments.length} RECORDS</span>
          </div>

          {payments.length === 0 ? (
            <p className="empty-state">No transactions recorded yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>PAYMENT ID</th><th>FROM</th><th>TO</th><th>AMOUNT</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>#{payment.id}</td>
                      <td>Account #{payment.sender_id}</td>
                      <td>Account #{payment.receiver_id}</td>
                      <td className="amount-cell">{money(payment.amount)}</td>
                      <td><span className={`status-pill ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>PayMesh · Payment processing and reliability simulation platform</footer>
      </main>
    </div>
  );
}

export default App;
