import styled from "styled-components";
import { movies } from "../../example_data/movies";
const PaymentList = () => {
    return (
        <div>
            <Container>
                {movies.map((movie) => (
                    <Ticket key={movie.id}>
                        <img src={movie.poster} alt={movie.title} />
                        <TicketInfo>
                            <h3>{movie.title}</h3>
                            <p>2025.3.15</p>
                            <p>미키17(2D)</p>
                            <p>총가격　　　30000원</p>
                            <p>할인금액　　 -2000원</p>
                            <p>최종가격 　　28000원</p>

                        </TicketInfo>
                        <TicketInfo>
                            <h3> </h3>
                            <p>예매번호 45321312</p>
                            <p>결제번호 12321132</p>
                            <p>사용포인트:2000원</p>
                            <p>적립포인트:2800원</p>
                        </TicketInfo>
                    </Ticket>
                ))}
            </Container>
        </div>
    )
}
export default PaymentList;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Ticket = styled.div`
  display: flex;
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  img {
    width: 100px;
    height: 140px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 20px;
  }
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
    margin-right:15px;
  h3 {
    margin: 0 0 10px;
  }

  p {
    margin: 2px 0;
    font-size: 14px;
    color: #333;
  }
`

