export default function Escrow({ address, arbiter, beneficiary, value, status, handleApprove }) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className={status === 1 ? "button" : "complete"}
          id={address}
          style={{ pointerEvents: status === 0 && "none" }}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          {status === 1 ? "Approve" : "✓ It's been approved!"}
        </div>
      </ul>
    </div>
  );
}
