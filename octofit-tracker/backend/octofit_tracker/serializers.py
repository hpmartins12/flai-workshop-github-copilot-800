from rest_framework import serializers
from bson import ObjectId
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'password', 'team_id', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class TeamSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'members_count', 'created_at']

    def get_members_count(self, obj):
        return User.objects.filter(team_id=str(obj.id)).count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'calories', 'distance', 'notes', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class LeaderboardSerializer(serializers.ModelSerializer):
    team_name = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['id', 'team_id', 'team_name', 'total_calories', 'total_activities', 'rank', 'updated_at']

    def get_team_name(self, obj):
        try:
            return Team.objects.get(id=obj.team_id).name
        except (Team.DoesNotExist, ValueError):
            return obj.team_id

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration', 'calories_estimate', 'category', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if '_id' in representation and isinstance(representation['_id'], ObjectId):
            representation['_id'] = str(representation['_id'])
        if representation.get('id') and isinstance(representation['id'], ObjectId):
            representation['id'] = str(representation['id'])
        return representation
