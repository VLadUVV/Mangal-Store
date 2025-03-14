import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getGlobalProfile } from "./Profile";

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("https://vladuvv-mangal-store-3df2.twc1.net/api/reviews");
      
      // Проверка Content-Type
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const htmlError = await response.text();
        console.error("Сервер вернул HTML:", htmlError);
        throw new Error("Сервер вернул HTML вместо JSON");
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка загрузки");
      }
  
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Ошибка:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить отзывы",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите текст отзыва",
        variant: "destructive",
      });
      return;
    }

    const profile = getGlobalProfile();
    const author = profile?.fio || "Гость";

    try {
      const response = await fetch("https://vladuvv-mangal-store-3df2.twc1.net/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, rating, content: newReview }),
      });

      // Проверка на корректный JSON
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Некорректный ответ сервера: ${contentType}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка отправки отзыва");
      }

      const savedReview = await response.json();
      setReviews([savedReview, ...reviews]);
      setNewReview("");
      setRating(5);
      toast({ title: "Успех", description: "Отзыв принят!" });
    } catch (error) {
      console.error("Ошибка:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить отзыв",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-mangal-600">Отзывы</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Напишите ваш отзыв</h2>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Поделитесь опытом или впечатлениями..."
            className="mb-4"
          />
          <Button onClick={handleSubmitReview}>Отправить отзыв</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">Пока нет отзывов. Будьте первым!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{review.author}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}